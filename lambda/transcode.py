import os
import sys
import time

import boto3

pipeline_id = "1510345309433-7lh0wb"
movie_bucket_name = "movies.osteele.com"  # TODO read these from the pipeline
thumbnail_bucket_name = "images.osteele.com"
preset_id = "1510432481093-rhpjuv"
# http://docs.aws.amazon.com/elastictranscoder/latest/developerguide/system-presets.html
public_read_grant = {
    "Grantee": {
        "Type": "Group",
        "URI": "http://acs.amazonaws.com/groups/global/AllUsers",
    },
    "Permission": "READ",
}
s3 = boto3.resource("s3")
transcoder = boto3.client("elastictranscoder", "us-east-1")


def transcode(input_key, wait=True):
    print("Transcoding", input_key)
    output_key_prefix = "design-elements/"
    output_key_base = os.path.splitext(input_key.split("/")[-1])[0]
    outputs = output_objects(input_key, output_key_prefix, output_key_base)
    for obj in outputs:
        print("Deleting {}/{}".format(s3.bucket_name, s3.key))
        obj.delete()
    job = transcoder.create_job(
        PipelineId=pipeline_id,
        Input={
            "Key": input_key,
            "FrameRate": "auto",
            "Resolution": "auto",
            "AspectRatio": "auto",
            "Interlaced": "auto",
            "Container": "auto",
        },
        Output={
            "Key": output_key_base + ".mp4",
            "ThumbnailPattern": output_key_base + "-{resolution}-{count}",
            "PresetId": preset_id,
        },
        OutputKeyPrefix=output_key_prefix,
    )["Job"]
    status = None
    while wait and status in (None, "Submitted", "Progressing"):
        job = transcoder.read_job(Id=job["Id"])["Job"]
        new_status = job["Status"]
        if new_status != status:
            status = new_status
            print("Job Status:", status)
        if new_status == "Error":
            print(job["Output"]["StatusDetail"])
            sys.exit(1)
        time.sleep(1)
    for obj in (
        obj
        for obj in output_objects(input_key, output_key_prefix, output_key_base)
        if public_read_grant not in obj.Acl().grants
    ):
        print("Setting {} ACL to public-read".format(obj.key))
        obj.Acl().put(ACL="public-read")


def output_objects(input_key, output_key_prefix, output_key_base):
    return [
        obj
        for bn in [movie_bucket_name, thumbnail_bucket_name]
        for obj in s3.Bucket(bn)
        .objects.filter(Prefix=output_key_prefix + output_key_base)
        .all()
        if obj.key != input_key
    ]


# movie_bucket = s3.Bucket(movie_bucket_name)
# transcoded = {
#     obj.key for obj in movie_bucket.objects.filter(Prefix="design-elements/").all()
# }
# print(transcoded)
# for obj in movie_bucket.objects.filter(Prefix='odes/').all():
#     print(obj.key, obj.key.split('/')[-1] in {p.split('/')[-1] for p in transcoded})

# transcode('odes/HopperTest01.mov')
# transcode('odes/QEA_Idea_Generation_v2.mov')
# transcode('odes/SoftDes Ideation v1.mov')
transcode("odes/StudentMeetingTest02.mov")
